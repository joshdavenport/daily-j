const {promisify} = require('util');
import md5 from 'md5';
import favicon from 'favicon';
const faviconAsync = promisify(favicon);

import getFirestore from './getFirestore';
import getPinboard from './getPinboard';

export default class Store {

    constructor() {
        this.firestore = getFirestore();
        this.pinboard = getPinboard();

        return this;
    }

    async getGroups() {
        const groupsSnapshot = await this.firestore.collection('groups').get();
        return groupsSnapshot.docs.map(doc => doc.data());
    }

    getLinksCollection(tags) {
        if(typeof tags !== 'array' && typeof tags !== 'object') {
            tags = [tags];
        }

        let linksCollection = this.firestore.collection('links');
        for (const filterTag of tags) {
            linksCollection = linksCollection.where(`tag-${filterTag}`, '==', true);
        }

        return linksCollection;
    }

    async getLinks(tags) {
        const linksSnapshot = await this.getLinksCollection(tags).get();

        return linksSnapshot.docs.map(doc => doc.data());
    }

    async updateGroup(group) {
        const tags = group.tags;

        let pinboardLinks;
        await new Promise(async (resolve, reject) => {
            this.pinboard.all({tag: tags.join(',')}, (err, result) => {
                pinboardLinks = result;
                resolve();
            });
        });

        const writeBatch = this.firestore.batch();

        if(pinboardLinks.length) {
            const deleteBatch = this.firestore.batch();

            const linksSnapshot = await this.getLinksCollection(tags).get();
            linksSnapshot.forEach(doc => {
                deleteBatch.delete(doc.ref);
            });
            await deleteBatch.commit();

            for (const pin of pinboardLinks) {
                const pinTags = {};
                pin.tags.split(' ').forEach(tag => pinTags[`tag-${tag}`] = true);

                const docId = tags.join(',') + '-' + pin.href.replace(/[^a-zA-Z0-9-_]/g, '');
                const newLinkRef = this.firestore.collection('links').doc(docId);
                const faviconUrl = await faviconAsync(pin.href);
                writeBatch.set(newLinkRef, {
                    label: pin.description,
                    url: pin.href,
                    faviconUrl,
                    ...pinTags
                });
            }
        }

        writeBatch.set(this.firestore.collection('groups').doc(group.tags.join(',')), {
            expires: new Date(Date.now() + (60 * 60 * 24 * 1000)),
            tags
        });
        
        await writeBatch.commit();
    }

}