package com.goTripcy.util;

import java.util.Properties;

import javax.mail.Authenticator;
import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class SendCstMail {

	public SendCstMail() {
		
	}
	public void sendMailContent(final HttpServletRequest request, final HttpServletResponse response) {
	   String name = request.getParameter("userName");
	   String number = request.getParameter("userNumber");
	   String to = "gotripcy@gmail.com";
	   String from = "info@traveoo.com";
	   Properties properties = System.getProperties();
	   properties.put("mail.smtp.starttls.enable", "true");
	   properties.put("mail.smtp.auth", "true");
	   properties.put("mail.smtp.host", "smtp.gmail.com");
	   properties.put("mail.smtp.port", "587");
	   Session session = Session.getDefaultInstance(properties, new Authenticator() {
		    protected PasswordAuthentication  getPasswordAuthentication() {
		    return new PasswordAuthentication(
		                "gotripcy@gmail.com", "test@123");
		            }
		});
	   try {
	      MimeMessage message = new MimeMessage(session);
	      message.setFrom(new InternetAddress(from));
	      message.addRecipient(Message.RecipientType.TO, new InternetAddress(to));
	      message.setSubject("Travel Requirement!!");
	      message.setText("Click me to call ----- name: "+name+"------ number: "+number);
	      Transport.send(message);
	   }catch (MessagingException mex) {
	      mex.printStackTrace();
	   }
	}

}
