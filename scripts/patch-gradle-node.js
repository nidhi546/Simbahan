#!/usr/bin/env node
// Re-applies gradle node-binary patches that get wiped by npm install.
// These patches make Gradle scripts read NODE_BINARY / node.binary JVM property
// instead of calling bare 'node' (which fails when Gradle runs from Android Studio
// because the IDE's PATH doesn't include /opt/homebrew/bin).
const fs = require('fs');
const path = require('path');

const patches = [
  {
    file: 'node_modules/expo-modules-autolinking/scripts/android/autolinking_implementation.gradle',
    find: "    String[] args = [\n      'node',",
    replace: "    String nodeBin = System.getenv('NODE_BINARY') ?: System.getProperty('node.binary') ?: 'node'\n    String[] args = [\n      nodeBin,",
  },
  {
    file: 'node_modules/expo/scripts/autolinking.gradle',
    find: 'def autolinkingPath = ["node", "--print",',
    replace: 'def autolinkingPath = [System.getenv(\'NODE_BINARY\') ?: System.getProperty(\'node.binary\') ?: \'node\', "--print",',
  },
  {
    // expo-constants: providers.exec hardcodes bare 'node'; use full path via system property.
    file: 'node_modules/expo-constants/scripts/get-app-config-android.gradle',
    find: 'def expoConstantsDir = project.providers.exec {\n  workingDir(projectDir)\n  commandLine("node", "-e", "console.log(require(\'path\').dirname(require.resolve(\'expo-constants/package.json\')));")' +
          '\n}.standardOutput.asText.get().trim()\n\ndef config = project.hasProperty("react") ? project.react : [];\ndef nodeExecutableAndArgs = config.nodeExecutableAndArgs ?: ["node"]',
    replace: 'def nodeBinaryPath = System.getenv(\'NODE_BINARY\') ?: System.getProperty(\'node.binary\') ?: \'node\'\ndef expoConstantsDir = project.providers.exec {\n  workingDir(projectDir)\n  commandLine(nodeBinaryPath, "-e", "console.log(require(\'path\').dirname(require.resolve(\'expo-constants/package.json\')));")' +
             '\n}.standardOutput.asText.get().trim()\n\ndef config = project.hasProperty("react") ? project.react : [];\ndef nodeExecutableAndArgs = config.nodeExecutableAndArgs ?: [nodeBinaryPath]',
  },
  {
    // AGP 8.x registers the release component lazily after all afterEvaluate hooks;
    // use configureEach on the components container so it fires whenever AGP adds 'release'.
    file: 'node_modules/expo-modules-core/android/ExpoModulesCorePlugin.gradle',
    find: "        release(MavenPublication) {\n          from components.release\n        }\n      }\n      repositories {\n        maven {\n          url = mavenLocal().url\n        }\n      }\n    }\n  }\n}",
    replace: "        release(MavenPublication) {\n        }\n      }\n      repositories {\n        maven {\n          url = mavenLocal().url\n        }\n      }\n    }\n    project.components.configureEach { component ->\n      if (component.name == \"release\") {\n        publishing.publications.named(\"release\", MavenPublication) { pub ->\n          pub.from(component)\n        }\n      }\n    }\n  }\n}",
  },
  {
    // Fix: react-native-screens RNSScreenRemovalListener.h — RN 0.79 removed
    // 'parentShadowView' from ShadowViewMutation. Add a mutable tag→componentName
    // map so the .cpp can still identify the parent component type.
    file: 'node_modules/react-native-screens/cpp/RNSScreenRemovalListener.h',
    find: '#include <react/renderer/mounting/ShadowView.h>\n\nusing namespace facebook::react;\n\nstruct RNSScreenRemovalListener : public MountingOverrideDelegate {\n  std::function<void(int)> listenerFunction_;\n  RNSScreenRemovalListener(std::function<void(int)> &&listenerFunction_)\n      : listenerFunction_(std::move(listenerFunction_)) {}',
    replace: '#include <react/renderer/mounting/ShadowView.h>\n#include <string>\n#include <unordered_map>\n\nusing namespace facebook::react;\n\nstruct RNSScreenRemovalListener : public MountingOverrideDelegate {\n  std::function<void(int)> listenerFunction_;\n  mutable std::unordered_map<Tag, std::string> tagToComponentName_;\n\n  RNSScreenRemovalListener(std::function<void(int)> &&listenerFunction_)\n      : listenerFunction_(std::move(listenerFunction_)) {}',
  },
  {
    // Fix: react-native-screens RNSScreenRemovalListener.cpp — replace direct
    // 'mutation.parentShadowView' access (removed in RN 0.79) with a persistent
    // tag→componentName map lookup via the new 'mutation.parentTag' field.
    file: 'node_modules/react-native-screens/cpp/RNSScreenRemovalListener.cpp',
    find: '  for (const ShadowViewMutation &mutation : mutations) {\n    if (mutation.type == ShadowViewMutation::Type::Remove &&\n        mutation.oldChildShadowView.componentName != nullptr &&\n        strcmp(mutation.parentShadowView.componentName, "RNSScreenStack") ==\n            0) {\n      listenerFunction_(mutation.oldChildShadowView.tag);\n    }\n  }\n\n  return MountingTransaction{',
    replace: '  for (const ShadowViewMutation &mutation : mutations) {\n    if (mutation.newChildShadowView.tag != 0 &&\n        mutation.newChildShadowView.componentName != nullptr) {\n      tagToComponentName_[mutation.newChildShadowView.tag] =\n          mutation.newChildShadowView.componentName;\n    }\n    if (mutation.type == ShadowViewMutation::Type::Delete &&\n        mutation.oldChildShadowView.tag != 0) {\n      tagToComponentName_.erase(mutation.oldChildShadowView.tag);\n    }\n  }\n\n  for (const ShadowViewMutation &mutation : mutations) {\n    if (mutation.type == ShadowViewMutation::Type::Remove &&\n        mutation.oldChildShadowView.componentName != nullptr) {\n      auto it = tagToComponentName_.find(mutation.parentTag);\n      if (it != tagToComponentName_.end() &&\n          it->second == "RNSScreenStack") {\n        listenerFunction_(mutation.oldChildShadowView.tag);\n      }\n    }\n  }\n\n  return MountingTransaction{',
  },
  {
    // Fix: ExpoGradleHelperExtension calls bare 'node' to locate react-native/package.json.
    // Gradle daemon doesn't inherit the shell PATH, so 'node' can't be found when running
    // from Android Studio. Use NODE_BINARY env var or node.binary JVM property instead.
    file: 'node_modules/expo-modules-core/expo-module-gradle-plugin/src/main/kotlin/expo/modules/plugin/gradle/ExpoGradleHelperExtension.kt',
    find: '    reactNativeDir = reactNativeDirFromSource ?: File(\n      project.providers.exec { env ->\n        env.workingDir(project.rootDir)\n        env.commandLine("node", "--print", "require.resolve(\'react-native/package.json\')")',
    replace: '    val nodeBin = System.getenv("NODE_BINARY") ?: System.getProperty("node.binary") ?: "node"\n    reactNativeDir = reactNativeDirFromSource ?: File(\n      project.providers.exec { env ->\n        env.workingDir(project.rootDir)\n        env.commandLine(nodeBin, "--print", "require.resolve(\'react-native/package.json\')")',
  },
  {
    // Fix: expo-module-gradle-plugin Kotlin plugin calls getByName("release") inside
    // afterEvaluate, but AGP 8.8+ creates the SoftwareComponent lazily. Also, finalizeDsl
    // can fire before expoModule { canBePublished false } is evaluated, causing the
    // afterEvaluate block to run even for non-publishable modules.
    file: 'node_modules/expo-modules-core/expo-module-gradle-plugin/src/main/kotlin/expo/modules/plugin/ProjectConfiguration.kt',
    find: '  afterEvaluate {\n    val publicationInfo = PublicationInfo(this)\n\n    publishingExtension()',
    replace: '  afterEvaluate {\n    if (!expoModulesExtension.canBePublished) return@afterEvaluate\n    val releaseComponent = components.findByName("release") ?: return@afterEvaluate\n    val publicationInfo = PublicationInfo(\n      components = releaseComponent,\n      groupId = group.toString(),\n      artifactId = requireNotNull(androidLibraryExtension().namespace) {\n        "\'android.namespace\' is not defined"\n      },\n      version = requireNotNull(androidLibraryExtension().defaultConfig.versionName) {\n        "\'android.defaultConfig.versionName\' is not defined"\n      }\n    )\n\n    publishingExtension()',
  },
];

const root = path.join(__dirname, '..');
let allOk = true;

for (const { file, find, replace } of patches) {
  const filePath = path.join(root, file);
  if (!fs.existsSync(filePath)) {
    console.warn(`patch-gradle-node: skipping missing file ${file}`);
    continue;
  }
  let content = fs.readFileSync(filePath, 'utf8');
  if (content.includes(replace)) {
    console.log(`patch-gradle-node: already patched ${file}`);
    continue;
  }
  if (!content.includes(find)) {
    console.warn(`patch-gradle-node: could not find patch target in ${file} — file may have changed`);
    allOk = false;
    continue;
  }
  fs.writeFileSync(filePath, content.replace(find, replace));
  console.log(`patch-gradle-node: patched ${file}`);
}

if (!allOk) process.exit(1);
