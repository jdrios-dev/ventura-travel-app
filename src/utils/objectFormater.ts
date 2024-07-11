export const ObjectFormater = (res: any) => {
  for (let name in res) {
    if (name === 'replacements') {
      for (name in res.replacements) {
        if (name.startsWith('%')) {
          const replaced_key = name.replace('%', '');
          const remove = replaced_key.replace('%', '');
          res.replacements[remove] = res.replacements[name];
          delete res.replacements[name];
        }
      }
    }
  }
  return res;
};
