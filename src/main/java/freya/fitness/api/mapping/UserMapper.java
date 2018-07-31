package freya.fitness.api.mapping;

import freya.fitness.api.dto.MembershipDto;
import freya.fitness.api.dto.UserDto;
import freya.fitness.api.dto.UserPreferenceDto;
import freya.fitness.domain.jpa.Membership;
import freya.fitness.domain.jpa.Role;
import freya.fitness.domain.jpa.User;
import freya.fitness.service.MembershipService;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserMapper {

  private final MembershipService membershipService;
  private final MembershipMapper membershipMapper;
  private final UserPreferencesMapper userPreferencesMapper;

  @Autowired
  public UserMapper(final MembershipService membershipService,
                    final MembershipMapper membershipMapper,
                    final UserPreferencesMapper userPreferencesMapper) {
    this.membershipService = membershipService;
    this.membershipMapper = membershipMapper;
    this.userPreferencesMapper = userPreferencesMapper;
  }

  public UserDto map(final User user) {
    if (user == null) {
      return null;
    }

    final UserDto dto = new UserDto();

    dto.setId(user.getId());
    dto.setFirstname(user.getFirstName());
    dto.setLastname(user.getFamilyName());
    dto.setEmail(user.getEmail());

    // roles
    final Map<String, Boolean> roles = user.getRoles().stream()
        .map(Role::getAuthority)
        .collect(Collectors.toMap(Function.identity(), role -> true));
    dto.setRoles(roles);

    // memberships
    final List<Membership> memberships =
        membershipService.getValidMembershipsForUser(user.getId());
    final List<MembershipDto> membershipDtos = memberships.stream()
        .map(membershipMapper::map)
        .collect(Collectors.toList());
    dto.setMemberships(membershipDtos);

    // preferences
    final List<UserPreferenceDto> preferences = user.getPreferences().stream()
        .map(userPreferencesMapper::map)
        .collect(Collectors.toList());
    dto.setPreferences(preferences);

    return dto;
  }

}
