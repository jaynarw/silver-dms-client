import { some } from 'lodash';

function filterByTag(files, tags) {
  return files.filter((file) => some(tags.map((tag) => file['Type of material'].includes(tag))));
}
export default filterByTag;
