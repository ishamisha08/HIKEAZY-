import nodemailer from 'nodemailer';

const transporterConfig = {
  host: process.env.SMTP_HOST ,
  port: process.env.SMTP_PORT ,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: process.env.NODE_ENV === 'production',
  },
};

const transporter = nodemailer.createTransport(transporterConfig);

transporter.verify((error, success) => {
  if (error) {
    console.error('SMTP Transporter Error:', error);
  } else {
    console.log('SMTP Transporter Ready:', success);
  }
});

export default transporter;