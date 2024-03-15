const nodemailer = require('nodemailer');
export function generateRandomPassword(length: number): string {
    const characters = '0123456789';
    const passwordArray = [];
  
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      passwordArray.push(characters.charAt(randomIndex));
    }
    return passwordArray.join('');
  }


  // Nodemailer function
  export function createTransporter() {
    return nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      },
    });
  }
