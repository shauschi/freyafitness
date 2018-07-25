package freya.fitness.api.mapping;

import freya.fitness.api.dto.CreateMembershipDto;
import freya.fitness.api.dto.MembershipDto;
import freya.fitness.api.dto.NewsDto;
import freya.fitness.api.dto.ValidityDto;
import freya.fitness.domain.jpa.Membership;
import freya.fitness.domain.jpa.MembershipType;
import freya.fitness.domain.jpa.News;
import freya.fitness.domain.jpa.User;
import freya.fitness.repository.jpa.MembershipTypeRepository;
import freya.fitness.service.MembershipTypeService;
import freya.fitness.service.ParticipationService;
import freya.fitness.service.UserService;
import java.util.Optional;
import java.util.function.BiFunction;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class MembershipMapper {

  @Autowired
  private UserService userService;

  @Autowired
  private MembershipTypeService membershipTypeService;

  @Autowired
  private ParticipationService participationService;

  public Membership map(final CreateMembershipDto dto) {
    if (dto == null) {
      return null;
    }
    final Membership membership = new Membership();
    final User user = userService.getUser(dto.getUserId());
    membership.setUser(user);
    final MembershipType type = membershipTypeService.getMembershipType(dto.getMembershipTypeId());
    membership.setType(type);
    membership.setValidity(dto.getValidity().toValidity());

    return membership;
  }

  public MembershipDto map(final Membership membership) {
    if (membership == null) {
      return null;
    }
    final MembershipDto dto = new MembershipDto();

    dto.setMembershipTypeId(membership.getType().getId());
    dto.setValidity(new ValidityDto(membership.getValidity()));
    long participations = participationService.getParticipationCount(membership);
    dto.setParticipations(participations);

    return dto;
  }

}
