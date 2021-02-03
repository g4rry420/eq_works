import React, { Component } from 'react'

import "./error-boundary.styles.css"

export default class ErrorBoundary extends Component {
    constructor() {
        super()

        this.state = {
            hasErrored: false
        }
    }

    static getDerivedStateFromError(error) {
        //process the error
        return { hasErrored: true }
    }

    componentDidCatch(error, info) {
        console.log(error);
    }

    render() {
        if(this.state.hasErrored){
            return (
                <div className="ErrorImageOverlay">
                    <div className="ErrorImageContainer">
                    </div>
                    <h2 className="ErrorImageText">Sorry, This Page is Broken.</h2>
                </div>
            )
        }else {
            return this.props.children;
        }
    }
}
