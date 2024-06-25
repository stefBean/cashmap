const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');

const MAILGUN_API_KEY = 'c7e14ca9005b657a659606eb8da12ab4-fe9cf0a8-ab894fd8';
const MAILGUN_DOMAIN = 'sandbox61f0a2c178734ffa9b4fa1f0f41d6278.mailgun.org';

const sendEmail = async (req, res) => {
    const { email, joke } = req.body;

    const mailgunUrl = `https://api.mailgun.net/v3/${MAILGUN_DOMAIN}/messages`;
    const data = new URLSearchParams();
    data.append('from', 'Excited User <mailgun@${MAILGUN_DOMAIN}>');
    data.append('to', email);
    data.append('subject', 'Yo Mama Joke');
    data.append('text', joke);

    try {
        await axios.post(mailgunUrl, data, {
            auth: {
                username: 'api',
                password: MAILGUN_API_KEY
            }
        });
        res.status(200).send('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).send('Error sending email');
    }
};

app.post('/send-email', sendEmail);
