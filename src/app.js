const path = require('path')
const express = require('express');
const hbs = require('hbs');
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const app = express();

// Define paths for Express config.
const paritalsPath = path.join(__dirname, '../templates/partials');

// Setup handlebars engines and views location.
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, '../templates/views'))
hbs.registerPartials(paritalsPath);

// Setup static directory to serve.
app.use(express.static(path.join(__dirname, '../public')));

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather App',
        name: 'Xuan'
    });
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Me',
        name: 'Xuan'
    });
})

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help',
        name: 'Xuan',
        helpText: 'This is some help text.'
    });
})

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'No address provided!'
        });
    }

    geocode(req.query.address, (error, { latitude, longitude, location }={}) => {
        if (error) {
            return res.send({
                error
            });
        }

        forecast(latitude, longitude, (error, forecastData) => {
            if (error) {
                return res.send({
                    error
                });
            }

            res.send({
                forecast: forecastData,
                location: location,
                address: req.query.address
            });
        })
    })
})

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Xuan',
        errMsg: 'Help article not found'
    });
});

app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Xuan',
        errMsg: 'Page not found'
    });
});

app.listen(3000, () => {
    console.log('Server is up on port 3000 ...');
})