import Store from './store';
import { promisify } from 'util';

export default async () => {
    const store = new Store();

    const linkGroups = [];

    const groups = await store.getGroups();
    for (const group of groups) {
        const tags = group.tags;

        if(Date.now() > (group.expires.seconds * 1000)) {
            await store.updateGroup(group);
        }

        const linkGroupsLinks = [];

        const links = await store.getLinks(tags);

        for (const link of links) {
            linkGroupsLinks.push({
                'label': link.label,
                'url': link.url,
                'faviconUrl': link.faviconUrl
            });
        }

        if(linkGroupsLinks.length) {
            linkGroups.push({
                'label': tags.join('+'),
                'links': linkGroupsLinks,
                'flourish': group.flourish,
                'order': group.order
            });
        }
    }

    return linkGroups;
}