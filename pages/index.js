import React from 'react'
import _ from 'lodash';
import getLinkGroups from '../src/getLinkGroups';

require('dotenv').config();

import "../scss/styles.scss";

const appPackage = require('../package.json');

class Index extends React.Component {

    static async getInitialProps({ req }) {
        const linkGroups = await getLinkGroups();

        return { linkGroups };
    }

    render() {
        return (
            <div>
                <h1>{appPackage.displayName.split('').map((char, i) => <span key={i} data-char={char.toLowerCase()}>{char}</span>)}</h1>
                <div className="links">
                    {_.chain(this.props.linkGroups).orderBy(['order', 'label'], ['asc', 'asc']).map(linkGroup => 
                        <div className="links-group" key={linkGroup.label}>
                            <h2 className="links-group__title">
                                <span className="links-group__title-text">{linkGroup.label}</span>
                                {linkGroup.flourish ? <span className="links-group__title-flourish">{linkGroup.flourish}</span> : ''}
                            </h2>
                            <ul className="links-group__list">
                                {_.chain(linkGroup.links).orderBy(['label'], ['asc']).map(link => (
                                    <li key={link.label} className="link">
                                        <a href={link.url}>
                                            <img src={link.faviconUrl} className="link__image"/>
                                            <span className="link__text">{link.label}</span>
                                            <span className="link__href">{link.url.replace(/^https?:\/\// ,'').replace(/\/.*/, '')}</span>
                                        </a>
                                    </li>
                                )).value()}
                            </ul>
                        </div>
                    ).value()}
                </div>
            </div>
        );
    }

}

export default Index