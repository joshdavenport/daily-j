import getFirestore from '../src/getFirestore';

export default class Store {

    constructor() {
        this.firestore = getFirestore();

        return this;
    }

    async getGroups() {
        const groupsSnapshot = await this.firestore.collection('groups').get();
        return groupsSnapshot.docs.map(doc => doc.data());
    }

    async getLinks(tags) {
        if(typeof tags !== 'array') {
            tags = [tags];
        }

        let linksCollection = this.firestore.collection('links');
        for (const tag of tags) {
            linksCollection = linksCollection.where(`tags.${tag}`, '==', true);
        }
        const linksSnapshot = await linksCollection.get();

        return linksSnapshot.docs.map(doc => doc.data());
    }

}