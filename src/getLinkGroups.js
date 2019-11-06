import Store from '../src/store';
import { promisify } from 'util';
import favicon from 'favicon';
const faviconAsync = promisify(favicon);

export default async () => {
    const store = new Store();

    const linkGroups = [];

    for (const group of await store.getGroups()) {
        const tags = group.tags;

        const linkGroupsLinks = [];

        for (const link of await store.getLinks(tags)) {
            const faviconUrl = await faviconAsync(link.url);

            linkGroupsLinks.push({
                'label': link.label,
                'url': link.url,
                'favicon': faviconUrl
            });
        }

        if(linkGroupsLinks.length) {
            linkGroups.push({
                'label': tags.join('+'),
                'links': linkGroupsLinks
            });
        }
    }

    return linkGroups;
}