package freya.fitness.api.contact;

import freya.fitness.api.common.MessageDto;
import javax.validation.Valid;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/contact")
public class ContactController {

  private static final Logger LOGGER = LogManager.getLogger(ContactController.class);

  private final ContactService contactService;

  @Autowired
  public ContactController(final ContactService contactService) {
    this.contactService = contactService;
  }

  /**
   * Versendet eine Kontaktanfrage per Mail.
   * @param contactDto die Kontaktanfrage des Benutzers
   * @return Eine Meldung über die erfolgreiche oder nicht erfolgreiche Bearbeitung
   */
  @PostMapping
  public ResponseEntity<MessageDto> contact(@RequestBody @Valid final ContactDto contactDto) {
    try {
      contactService.sendContactRequest(contactDto);
      return ResponseEntity
          .ok(new MessageDto("Deine Nachricht wurde erfolgreich verschickt."));
    } catch (Exception e) {
      LOGGER.error("Fehler bei der Kontaktaufnahme {}", contactDto, e);
      return ResponseEntity
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .body(new MessageDto("Deine Nachricht konnte nicht verarbeitet werden."
              + " Bitte versuche es später erneut."));
    }
  }
}
