package freya.fitness.api.controller;

import freya.fitness.api.dto.CreateMembershipDto;
import freya.fitness.api.dto.MembershipDto;
import freya.fitness.api.mapping.MembershipMapper;
import freya.fitness.domain.jpa.Membership;
import freya.fitness.service.MembershipService;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/memberships")
public class MembershipController {

  private final MembershipService membershipService;
  private final MembershipMapper membershipMapper;

  @Autowired
  public MembershipController(final MembershipService membershipService,
                              final MembershipMapper membershipMapper) {
    this.membershipService = membershipService;
    this.membershipMapper = membershipMapper;
  }

  /**
   * Get all {@link Membership}s. Only for admins.
   *
   * @return list of all memberships
   */
  @PreAuthorize("hasAnyAuthority('ADMIN')")
  @GetMapping("/")
  public List<MembershipDto> getAllMemberships() {
    return membershipService.getAllMemberships().stream()
        .map(membershipMapper::map)
        .collect(Collectors.toList());
  }

  /**
   * Allows trainers and admins to create a new membership for an existing user.
   *
   * @param createMembership new membership with user and type information
   * @return newly created membership
   */
  @PreAuthorize("hasAnyAuthority('TRAINER', 'ADMIN')")
  @PostMapping("/")
  public MembershipDto createMembership(@RequestBody final CreateMembershipDto createMembership) {
    final Membership membership = membershipMapper.map(createMembership);
    final Membership savedMembership = membershipService.saveMembership(membership);
    return membershipMapper.map(savedMembership);
  }

  /**
   * Returns all information of an existing membership.
   *
   * @param id ID of the membership
   * @return existing membership
   */
  @PreAuthorize("hasAnyAuthority('USER', 'TRAINER', 'ADMIN')")
  @GetMapping("/{id}")
  public MembershipDto getMembership(@PathVariable("id") final UUID id) {
    return membershipMapper.map(membershipService.getMembership(id));
  }


}
