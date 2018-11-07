package freya.fitness.api.controller;

import freya.fitness.api.dto.ContactDto;
import freya.fitness.api.dto.MessageDto;
import freya.fitness.service.ContactService;
import javax.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/contact")
public class ContactController {

  private final ContactService contactService;

  @Autowired
  public ContactController(final ContactService contactService) {
    this.contactService = contactService;
  }

  @PostMapping("/")
  public MessageDto contact(@RequestBody @Valid final ContactDto contactDto) {
    contactService.sendContactRequest(contactDto);
    return new MessageDto("Deine Nachricht wurde erfolgreich verschickt.");
  }
}
