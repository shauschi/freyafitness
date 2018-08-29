package freya.fitness.api.controller;

import freya.fitness.api.dto.MessageDto;
import freya.fitness.service.ParticipationService;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/participations")
public class ParticipationController {

  private final ParticipationService participationService;

  @Autowired
  public ParticipationController(final ParticipationService participationService) {
    this.participationService = participationService;
  }

  /**
   * Deletes an existing participation.
   *
   * @param id ID of the participation
   * @return success message
   */
  @PreAuthorize("hasAnyAuthority('TRAINER', 'ADMIN')")
  @DeleteMapping("/{id}")
  public MessageDto deleteParticipation(@PathVariable("id") final UUID id) {
    participationService.deleteParticipation(id);
    return new MessageDto("Teilnahme gelöscht");
  }


}
