import React from 'react'
import getLinkGroups from '../src/getLinkGroups';

require('dotenv').config()

class Index extends React.Component {

    static async getInitialProps({ req }) {
        const linkGroups = await getLinkGroups();
        
        return { linkGroups };
    }

    render() {
        return (
            <div>
                <h1>daily j</h1>
                <div className="links">
                    {this.props.linkGroups.map(linkGroup => 
                        <div className="links__group" key={linkGroup.label}>
                            <h2>{linkGroup.label}</h2>
                            <ul>
                                {linkGroup.links.map(link => (
                                    <li key={link.label}>
                                        <a href={link.url}>
                                            <img src={link.favicon}/>
                                            <span>{link.label}</span>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        );
    }

}

export default Index