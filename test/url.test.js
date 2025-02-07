import request from 'supertest';
import mongoose from 'mongoose';
const dbURI = "mongodb://localhost:27017/url-shortener-test";
const token = "bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJnb29nbGVJZCI6IjExMjg1MzQ3NTk0MTU1ODg0NDgwMCIsIm5hbWUiOiJzdWJhc2hyZWUgdHYiLCJlbWFpbCI6InR2c3ViYXNocmVlQGdtYWlsLmNvbSIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS0vQUxWLVVqVzVhaE0xSHllU0Nnb0s4SGEwS1g2ZHlnU0RZQk00cnBIVGo1N3JtUld2LUpNa1ZnPXM5Ni1jIiwiaWF0IjoxNzM4ODU3NjYwfQ.d6SPhXjMPQHLewbml0q6qCmeRNibNrIWomBFVZT2_p4"
import app from '../src/index.js';
import {expect} from 'chai';


describe('Create shorten Api', () => {
  it('should shorten a long URL and return the short URL', async () => {
    const response = await request(app)
      .post('/api/shorten')
      .set('Authorization', token) // Add authorization header if needed
      .send({
        longUrl: 'https://example.com',
        customAlias: 'short1',
        topic: 'acquisition',
      });
      
    expect(response.status).to.equal(200);
    expect(response.body).to.have.property('shortUrl').that.includes('short1');
  });

  it('should return 400 for invalid URL format', async () => {
    const response = await request(app)
      .post('/api/shorten')
      .set('Authorization', token)
      .send({
        longUrl: 'invalid-url',
      });
    expect(response.status).to.equal(400);
    expect(response.body).to.have.property('message').that.equals('Invalid URL format');
  });
});


describe('Fetch shorten Api', () => {
  it('should redirect to the original URL', async () => {
    const alias = 'short1'; // Alias used in the previous test case
    const response = await request(app).get(`/api/shorten/${alias}`).set('Authorization', token).set('user-agent', 'PostmanRuntime/7.43.0');
    expect(response.header).to.have.property('location').that.equals('https://example.com');
  })

  it('should return 404 if the alias does not exist', async () => {
    const alias = 'nonexistentAlias';
    const response = await request(app).get(`/api/shorten/${alias}`).set('Authorization', token);
    expect(response.status).to.equal(400);
    expect(response.body).to.have.property('message').that.equals('URL not found');
  });
});

describe('Analytics API', () => {
  it('should retrieve analytics for a short URL', async() => {
    const alias = 'short1'; // Alias used in the previous test case
    const response = await request(app)
      .get(`/api/analytics/${alias}`) 
      .set('Authorization', token) 
    
      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('totalClicks').that.is.a('number');
      expect(response.body).to.have.property('uniqueUsers').that.is.a('number');
      expect(response.body).to.have.property('clicksByDate').that.is.an('array');
      expect(response.body).to.have.property('osType').that.is.an('array');
      expect(response.body).to.have.property('deviceType').that.is.an('array');
  });

  it('should retrieve analytics for a topic', async() => {
    const topic = 'acquisition'; // topic used in the previous test case
    const response = await request(app)
      .get(`/api/analytics/topic/${topic}`) 
      .set('Authorization', token) 
  
      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('totalClicks').that.is.a('number');
      expect(response.body).to.have.property('uniqueUsers').that.is.a('number');
      expect(response.body).to.have.property('clicksByDate').that.is.an('array');
      expect(response.body).to.have.property('urls').that.is.an('array');
  });

  it('should retrieve no analytics for a topic that does not exist', async() => {
    const response = await request(app)
      .get(`/api/analytics/topic/nonexistentTopic`) 
      .set('Authorization', token) 

      expect(response.status).to.equal(400);
      expect(response.body).to.have.property('message').that.equals( "No URLs found for this topic");
  });

  
  it('should retrieve overall analytics for a short urls created by particular user', async() => {
    const response = await request(app)
      .get(`/api/analytics/overall`) 
      .set('Authorization', token) 
  
      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('totalUrls').that.is.a('number');
      expect(response.body).to.have.property('totalClicks').that.is.a('number');
      expect(response.body).to.have.property('uniqueUsers').that.is.a('number');
      expect(response.body).to.have.property('clicksByDate').that.is.an('array');
      expect(response.body).to.have.property('osType').that.is.an('array');
      expect(response.body).to.have.property('deviceType').that.is.an('array');
  });

  it('should retrieve no overall analytics for a unauthorized user', async() => {
    const response = await request(app)
      .get(`/api/analytics/overall`) 
  
      expect(response.status).to.equal(401);
      expect(response.body).to.have.property('message').that.equals('No token, authorization denied');
  });
});

after(async () => {
  await mongoose.connection.db.collection('urls').deleteMany({});
  await mongoose.disconnect(); // Disconnect MongoDB
});
