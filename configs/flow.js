module.exports = function flow(options) {
  const ignore = ['.*/node_modules/.*', '.*/tests/.*', '.*\\.test\\.js'];

  if (options.workspaces) {
    ignore.push('.*/packages/.*/esm/.*', '.*/packages/.*/lib/.*');
  }

  return {
    ignore,
    include: [options.workspaces ? './packages' : './src'],
    lints: {
      all: 'warn',
      sketchy_null_bool: 'warn',
      sketchy_null_mixed: 'warn',
      sketchy_null_number: 'warn',
      sketchy_null_string: 'warn',
      unclear_type: 'warn',
      untyped_import: 'warn',
    },
    options: {
      emoji: true,
      'esproposal.class_instance_fields': 'enable',
      'esproposal.class_static_fields': 'enable',
      'esproposal.export_star_as': 'enable',
      include_warnings: true,
      'module.ignore_non_literal_requires': true,
    },
  };
};
