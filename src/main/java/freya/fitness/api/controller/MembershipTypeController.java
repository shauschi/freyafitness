package freya.fitness.api.controller;

import freya.fitness.api.dto.MembershipTypeDto;
import freya.fitness.service.MembershipTypeService;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/membershiptypes")
public class MembershipTypeController {

  private final MembershipTypeService membershipTypeService;

  @Autowired
  public MembershipTypeController(final MembershipTypeService membershipTypeService) {
    this.membershipTypeService = membershipTypeService;
  }

  /**
   * Returns a list of all currently valid {@link freya.fitness.domain.jpa.MembershipType}s.
   *
   * @return list of membership types
   */
  @PreAuthorize("hasAnyAuthority('USER', 'TRAINER', 'ADMIN')")
  @GetMapping("/")
  public List<MembershipTypeDto> getAllValidMembershipTypes() {
    return membershipTypeService.getValidMembershipTypes().stream()
        .map(MembershipTypeDto::new)
        .collect(Collectors.toList());
  }
}
