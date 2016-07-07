'use strict';
require('bootstrap/dist/css/bootstrap.css');
require('@norkart/bootstrap-override/bootstrap-override.css');
require('./../css/style.css');
var ReactDOM = require('react-dom');
var React = require('react');
var config = require('./config');
var MyMap = require('./MyMap.jsx');
var NorkartIdAuth = require('@norkart/norkartidjs');

var auth = NorkartIdAuth({
    clientId: 'bcb797f8-0a53-4925-885d-e3e7ae185b69',
    useApplicationBackend: true,
    profile: 'Test',
    appBackendUrl: 'https://tvm-webatlashar/WAAPI-ApplicationBackend/authorizationlookup'
});

auth.init();

auth.isLoggedIn(function (err, isLoggedIn) {
    if (!isLoggedIn) {
        auth.login(function () {});
    } else {
        auth.isWaapiLoggedIn(function (err, isWaapiLoggedIn) {
            if (!isWaapiLoggedIn) {
                ReactDOM.render(
                    <h1>Du har ikke tilgang..</h1>,
                    document.getElementById('map')
                );
            } else {
                auth.getUser(function (err, user) {
                    ReactDOM.render(
                        <MyMap apiKey={config.apiKey} NkAuth={auth} />,
                        document.getElementById('map')
                    );
                });
            }
        }); 
    }
});





