import { format, compareAsc } from 'date-fns';
import { every } from 'lodash';

export function formatDate(dateString) {
  const date = new Date(dateString);
  return format(date, 'dd LLL yyyy');
}

export function getFileId(url) {
  const urlObj = new URL(url);
  const urlParams = new URLSearchParams(urlObj.search);
  return urlParams.get('id');
}

export function filterAccepted(fileArray) {
  const filterAllAccepted = fileArray.filter((data) => {
    if (!data.acceptedFiles) {
      return true;
    }
    const ids = data['Upload Files'].map(getFileId);
    const flag = !(every(ids.map((id) => data.acceptedFiles[id])));
    return flag;
  });
  const filtered = [...filterAllAccepted];
  filtered.forEach((data) => {
    // eslint-disable-next-line no-param-reassign
    if (data.acceptedFiles) {
      data['Upload Files'] = data['Upload Files'].filter((url) => !data.acceptedFiles[getFileId(url)]);
    }
  });
  return filtered.sort((a,b) => {
    return compareAsc(new Date(a['Timestamp']), new Date(b['Timestamp']))
  });
}
