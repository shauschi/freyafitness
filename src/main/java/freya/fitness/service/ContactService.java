package freya.fitness.service;

import freya.fitness.api.dto.ContactDto;
import freya.fitness.utils.exception.MailTemplateNotFoundException;
import freya.fitness.utils.exception.ResourceLoadingException;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.mail.MessagingException;
import java.util.HashMap;
import java.util.Map;

@Service
public class ContactService {

  private static final Logger LOGGER = LogManager.getLogger(ContactService.class);

  @Value("${mail.contact.receiver}")
  private String emailTo;

  private final EmailService emailService;
  private final ResourceService resourceService;

  @Autowired
  public ContactService(final EmailService emailService, final ResourceService resourceService) {
    this.emailService = emailService;
    this.resourceService = resourceService;
  }

  public void sendContactRequest(final ContactDto contactDto)
      throws MessagingException, MailTemplateNotFoundException {
    final String subject = "Kontaktformular: " + contactDto.getSubject();
    final String message = getEmailText(contactDto);
    emailService.sendMail(emailTo, subject, message);
  }

  private String getEmailText(final ContactDto contactDto)
      throws MailTemplateNotFoundException {
    final String filename = "contact.html";
    final String template;
    try {
      template = resourceService.getResourceAsString(filename);
    } catch (final ResourceLoadingException e) {
      LOGGER.error("Could not read reset password file");
      throw new MailTemplateNotFoundException(filename);
    }

    final Map<String, String> params = new HashMap<>();
    params.put("firstname", contactDto.getFirstname());
    params.put("lastname", contactDto.getLastname());
    params.put("email", contactDto.getEmail());
    params.put("telephone", contactDto.getTelephone());

    final String message = contactDto.getMessage();
    final String replacedMessage = message.replaceAll("\n", "<br/>");
    params.put("message", replacedMessage);

    return resourceService.replacePlaceholder(template, params);
  }

}
