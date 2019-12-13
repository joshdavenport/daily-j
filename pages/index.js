import Head from 'next/head';
import React from 'react';
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
                <Head>
                    <title>{appPackage.displayName.toUpperCase()}</title>
                    <meta name="viewport" content="initial-scale=1.0, width=device-width" key="viewport" />
                    <link rel="apple-touch-icon" sizes="57x57" href="/apple-icon-57x57.png"/>
                    <link rel="apple-touch-icon" sizes="60x60" href="/apple-icon-60x60.png"/>
                    <link rel="apple-touch-icon" sizes="72x72" href="/apple-icon-72x72.png"/>
                    <link rel="apple-touch-icon" sizes="76x76" href="/apple-icon-76x76.png"/>
                    <link rel="apple-touch-icon" sizes="114x114" href="/apple-icon-114x114.png"/>
                    <link rel="apple-touch-icon" sizes="120x120" href="/apple-icon-120x120.png"/>
                    <link rel="apple-touch-icon" sizes="144x144" href="/apple-icon-144x144.png"/>
                    <link rel="apple-touch-icon" sizes="152x152" href="/apple-icon-152x152.png"/>
                    <link rel="apple-touch-icon" sizes="180x180" href="/apple-icon-180x180.png"/>
                    <link rel="icon" type="image/png" sizes="192x192"  href="/android-icon-192x192.png"/>
                    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"/>
                    <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png"/>
                    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"/>
                    <link rel="manifest" href="/manifest.json"/>
                    <meta name="theme-color" content="#353535"/>
                </Head>
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