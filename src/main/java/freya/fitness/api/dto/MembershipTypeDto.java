package freya.fitness.api.dto;

import freya.fitness.domain.jpa.MembershipType;
import java.util.UUID;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class MembershipTypeDto {

  private UUID id;
  private String key;
  private String name;
  private String description;
  private int maxParticipations;
  private int validityDays;
  private ValidityDto validity;

  public MembershipTypeDto(final MembershipType membershipType) {
    this.id = membershipType.getId();
    this.key = membershipType.getKey();
    this.name = membershipType.getName();
    this.description = membershipType.getDescription();
    this.maxParticipations = membershipType.getMaxParticipations();
    this.validityDays = membershipType.getValidityDays();
    this.validity = new ValidityDto(membershipType.getValidity());
  }
}
