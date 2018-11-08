package freya.fitness.service;

import freya.fitness.api.dto.ContactDto;
import freya.fitness.proxy.CreateEmail;
import freya.fitness.proxy.EmailProxy;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class ContactService {

  private static final Logger LOGGER = LogManager.getLogger(ContactService.class);

  @Value("${mail.contact.receiver}")
  private String emailTo;

  private final EmailProxy emailProxy;

  @Autowired
  public ContactService(final EmailProxy emailProxy) {
    this.emailProxy = emailProxy;
  }

  public void sendContactRequest(final ContactDto contactDto) {
    LOGGER.info("Handle contact request from {} {}", contactDto.getFirstname(), contactDto.getLastname());
    final CreateEmail event = new CreateEmail("CONTACT");
    event.setTo(Collections.singletonList(emailTo));

    final Map<String, String> params = new HashMap<>();
    params.put("firstname", contactDto.getFirstname());
    params.put("lastname", contactDto.getLastname());
    params.put("email", contactDto.getEmail());
    params.put("telephone", contactDto.getTelephone());
    params.put("subject", contactDto.getSubject());
    final String message = contactDto.getMessage();
    final String replacedMessage = message.replaceAll("\n", "<br/>");
    params.put("message", replacedMessage);

    event.setParameters(params);

    emailProxy.createEmail(event);
  }

}
