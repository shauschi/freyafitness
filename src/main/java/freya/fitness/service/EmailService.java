package freya.fitness.service;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.mail.Address;
import javax.mail.Authenticator;
import javax.mail.BodyPart;
import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeBodyPart;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeMultipart;
import java.io.IOException;
import java.util.Arrays;
import java.util.Properties;
import java.util.stream.Collectors;

@Service
public class EmailService {

  private static final Logger LOGGER = LogManager.getLogger(EmailService.class);

  private final Properties props;
  private final Boolean isDevelop;
  private final String developReceiver;
  private final String sender;
  private final Authenticator auth;

  @Autowired
  public EmailService(
      @Value("${isDevelop:true}") final Boolean isDevelop,
      @Value("${mail.develop.receiver}") final String developReceiver,
      @Value("${MAIL_HOST:localhost}") final String host,
      @Value("${MAIL_PORT:1124}") final Integer port,
      @Value("${MAIL_USR:todo}") final String username,
      @Value("${MAIL_PSW:todo}") final String password,
      @Value("${mail.sender}") final String sender) {
    this.isDevelop = isDevelop;
    this.developReceiver = developReceiver;
    this.sender = sender;

    this.props = new Properties();
    props.put("mail.transport.protocol", "smtp");
    props.put("mail.smtp.host", host);
    props.put("mail.smtp.port", port);
    props.put("mail.smtp.auth", "true");
    props.put("mail.smtp.starttls.enable", "true");
    props.put("mail.debug", "false");

    this.auth = new Authenticator() {
      public PasswordAuthentication getPasswordAuthentication() {
        return new PasswordAuthentication(username, password);
      }
    };
  }

  public void sendMail(
      final String to, final String subject, final String message) throws MessagingException {

    final Session session = Session.getInstance(props, auth);
    final MimeMessage mail = new MimeMessage(session);

    mail.setFrom(new InternetAddress(sender));
    final InternetAddress[] addresses = {new InternetAddress(to)};
    mail.setRecipients(Message.RecipientType.TO, addresses);
    mail.setSubject(subject);

    final MimeMultipart multipart = getMimeMultipart(message);
    mail.setContent(multipart);

    modifyForDevelopment(message, mail);
    sendMail(mail);
  }

  private void sendMail(final MimeMessage mail) throws MessagingException {
    try {
      Transport.send(mail);
    } catch (final MessagingException e) {
      LOGGER.error("Unable to send mail", e);
      if (!isDevelop) {
        throw e;
      } else {
        LOGGER.error("unable to send mail in development: \n{}\n{}\n\n{}",
            mail.getAllRecipients(),
            mail.getSubject(),
            getSaveMailContent(mail));
      }
    }
  }

  private String getSaveMailContent(final MimeMessage mail) {
    try {
      return mail.getContent().toString();
    } catch (final IOException | MessagingException e) {
      final String error = "unable to get content for mail";
      LOGGER.error(error, e);
      return error;
    }
  }

  private MimeMultipart getMimeMultipart(final String message) throws MessagingException {
    final MimeMultipart multipart = new MimeMultipart();
    final BodyPart messageBodyPart = new MimeBodyPart();
    messageBodyPart.setContent(message, "text/html; charset=utf-8");
    multipart.addBodyPart(messageBodyPart);
    return multipart;
  }

  /**
   * Ensure that no mails are sent to any other account but the development email account. To see the original receiver,
   * they will be added to the message.
   *
   * @param email mail that will be send
   */
  private void modifyForDevelopment(final String message, final Message email) throws MessagingException {
    if (isDevelop) {
      final Address[] originalTo = email.getRecipients(Message.RecipientType.TO);
      final Address[] originalCc = email.getRecipients(Message.RecipientType.CC);
      final Address[] originalBcc = email.getRecipients(Message.RecipientType.BCC);
      final String additionalText =
          "<p>"
              + "This mail was send from a development environment and was ment to be send"
              + "</p>"
              + getReceiverBlock("to", originalTo)
              + getReceiverBlock("cc", originalCc)
              + getReceiverBlock("bcc", originalBcc)
              + "<p><b>--- ORIGINAL MESSAGE ---</b></p>";
      final String newMailText = message.replaceFirst(
          "<body>(.*)</body>", "<body>" + additionalText + "$1</body>");

      final InternetAddress[] addresses = {new InternetAddress(developReceiver)};
      email.setRecipients(Message.RecipientType.TO, addresses);
      email.setRecipients(Message.RecipientType.CC, null);
      email.setRecipients(Message.RecipientType.BCC, null);

      final MimeMultipart multipart = getMimeMultipart(newMailText);
      email.setContent(multipart);
    }
  }

  private String getReceiverBlock(final String block, final Address[] receiver) {
    if (null == receiver || receiver.length == 0) {
      return "";
    }
    final String receiverString = Arrays.stream(receiver)
        .map(Address::toString)
        .collect(Collectors.joining(", "));
    return "<p>" + block + ": " + receiverString + "</p>";
  }

}
