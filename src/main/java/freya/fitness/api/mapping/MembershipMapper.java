package freya.fitness.api.mapping;

import freya.fitness.api.dto.CreateMembershipDto;
import freya.fitness.api.dto.MembershipDetailsDto;
import freya.fitness.api.dto.MembershipDto;
import freya.fitness.api.dto.NewsDto;
import freya.fitness.api.dto.ParticipationDto;
import freya.fitness.api.dto.ProfileDto;
import freya.fitness.api.dto.UserDto;
import freya.fitness.api.dto.ValidityDto;
import freya.fitness.domain.jpa.Membership;
import freya.fitness.domain.jpa.MembershipType;
import freya.fitness.domain.jpa.News;
import freya.fitness.domain.jpa.Participation;
import freya.fitness.domain.jpa.User;
import freya.fitness.repository.jpa.MembershipTypeRepository;
import freya.fitness.service.MembershipTypeService;
import freya.fitness.service.ParticipationService;
import freya.fitness.service.UserService;
import java.util.List;
import java.util.Optional;
import java.util.function.BiFunction;
import java.util.stream.Collectors;
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

  @Autowired
  private ProfileMapper profileMapper;

  @Autowired
  private ParticipationMapper participationMapper;

  public Membership map(final CreateMembershipDto dto) {
    if (dto == null) {
      return null;
    }
    final Membership membership = new Membership();
    final User user = userService.getUser(dto.getUser().getId());
    membership.setUser(user);
    final MembershipType type = membershipTypeService.getMembershipType(dto.getMembershipTypeId());
    membership.setType(type);
    membership.setValidity(dto.getValidity().toValidity());

    return membership;
  }


  public Membership map(final MembershipDetailsDto dto) {
    if (dto == null) {
      return null;
    }
    final Membership membership = new Membership();
    membership.setId(dto.getId());
    final User user = userService.getUser(dto.getUser().getId());
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
    final MembershipDto dto = mapCommonValues(membership);

    long participationCount = participationService.getParticipationCount(membership);
    dto.setParticipationCount(participationCount);

    return dto;
  }

  public MembershipDetailsDto mapDetails(final Membership membership) {
    if (membership == null) {
      return null;
    }
    final MembershipDetailsDto dto = mapCommonValues(membership);

    final List<Participation> participations = participationService.getParticipations(membership.getId());
    final List<ParticipationDto> participationDtos = participations.stream()
        .map(participationMapper::map)
        .collect(Collectors.toList());
    dto.setParticipations(participationDtos);
    dto.setParticipationCount(participationDtos.size());

    return dto;
  }

  private MembershipDetailsDto mapCommonValues(final Membership membership) {
    final MembershipDetailsDto dto = new MembershipDetailsDto();

    dto.setId(membership.getId());
    dto.setMembershipTypeId(membership.getType().getId());
    dto.setValidity(new ValidityDto(membership.getValidity()));
    final User user = membership.getUser();
    final ProfileDto profileDto = profileMapper.map(user);
    dto.setUser(profileDto);

    return dto;
  }

}
