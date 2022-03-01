const glob = require('glob');
const Joi = require('joi');
const fs = require('fs');
const path = require('path');
const fm = require('front-matter');

const { resolveFrontmatterMetadata } = require('../dist/gridsome/modules/post/utils');

const COMPATIBLE_PLUGINS = {
  '@gridsome/source-filesystem': {
    // Define whether, given the plugin and its options, it is possible
    // to validate plugin's markdown files
    canValidate: (pluginOptions) => {
      return pluginOptions && pluginOptions.path && pluginOptions.validation;
    },
    // Define how, given the plugin and its options, we get the glob patterns
    // for markdown files to validate
    constructGlobPatterns: (pluginOptions) => {
      const patterns = [];
      if (!pluginOptions) return patterns;

      patterns.push(
        path.join(pluginOptions.baseDir || '.', pluginOptions.path),
      );

      return patterns;
    },
  },
  // vue-remark effectively wraps source-filesystem, so we accept it too.
  '@gridsome/vue-remark': {
    canValidate: (pluginOptions) => {
      return pluginOptions && pluginOptions.baseDir && pluginOptions.validation;
    },
    constructGlobPatterns: (pluginOptions) => {
      const patterns = [];
      if (!pluginOptions) return patterns;

      const globPattern = path.join(pluginOptions.baseDir || '.', './**/*.md');
      patterns.push(globPattern);

      if (pluginOptions.includePaths) {
        patterns.push(pluginOptions.includePaths);
      }

      return patterns;
    },
  },
};

const validateFrontmatter = (gridsomeConfig) => {
  console.info('Validating markdown frontmatter data...');

  const pluginsToValidate = (gridsomeConfig.plugins || []).filter((plugin) => {
    const pluginHandler = COMPATIBLE_PLUGINS[plugin.use];
    return pluginHandler && pluginHandler.canValidate(plugin.options);
  });

  if (!pluginsToValidate.length) {
    console.info('No plugins with path and validation found.');
    return;
  }

  pluginsToValidate.forEach(validateFilesystemPluginMarkdownFiles);

  console.info('All plugins passed.');
};

const validateFilesystemPluginMarkdownFiles = (plugin) => {
  const { validation: validationSchema, typeName } = plugin.options;

  console.info(`Validating ${typeName}...`);

  const pluginHandler = COMPATIBLE_PLUGINS[plugin.use];
  const patterns = pluginHandler.constructGlobPatterns(plugin.options);

  patterns.forEach((pattern) => {
    const fileNames = glob.sync(pattern);

    fileNames.forEach((fileName) => {
      const fileContent = fs.readFileSync(fileName, 'utf-8');
      const frontmatterData = fm(fileContent);
      const frontmatterAttrs = resolveFrontmatterMetadata(frontmatterData.attributes);

      try {
        Joi.assert(frontmatterAttrs, validationSchema);
      } catch (err) {
        if (err) {
          err.message = `${err.message} (file ${fileName} from glob ${pattern} for type ${typeName})`;
        }
        throw err;
      }
    });
  });
};

if (require.main === module) {
  const gridsomeConfig = require('../gridsome.config');
  validateFrontmatter(gridsomeConfig);
}

module.exports = validateFrontmatter;
