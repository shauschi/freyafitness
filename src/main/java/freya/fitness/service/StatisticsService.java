package freya.fitness.service;

import freya.fitness.api.dto.StatisticDto;
import freya.fitness.domain.jpa.Course;
import freya.fitness.domain.jpa.CourseType;
import freya.fitness.domain.jpa.Participation;
import freya.fitness.domain.jpa.User;
import freya.fitness.domain.jpa.UserPreference;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

@Service
public class StatisticsService {

  private final UserService userService;

  private final ParticipationService participationService;

  private final UserPreferencesService userPreferencesService;

  @Autowired
  public StatisticsService(
      final UserService userService,
      final ParticipationService participationService,
      final UserPreferencesService userPreferencesService) {
    this.userService = userService;
    this.participationService = participationService;
    this.userPreferencesService = userPreferencesService;
  }

  /**
   * Returns a statistics object for a given user ID.
   *
   * @param userId given user ID
   * @return statistics
   */
  public StatisticDto getUserStats(final UUID userId) {
    final User currentUser = userService.getCurrentUser();
    if (currentUser == null
        || (!userId.equals(currentUser.getId()) && userWantsPrivacy(userId))) {
      throw new AccessDeniedException("You are not allowed to see this");
    }

    final List<Participation> participations =
        participationService.getParticipationsSince(userId, getStartForLastSixMonths());

    final StatisticDto stats = new StatisticDto();
    stats.setUserId(userId);

    final Map.Entry<CourseType, Long> maximum = getMaximumCourseParticipation(participations);
    if (maximum != null) {
      stats.setFavouriteCourseTypeId(maximum.getKey().getId());
      stats.setFavouriteCourseParticipations(maximum.getValue());
    }

    final Map<LocalDate, Long> participationsPerMonth = getParticipationsPerMonth(participations);
    stats.setParticipationsPerMonth(participationsPerMonth);

    return stats;
  }

  private boolean userWantsPrivacy(final UUID userId) {
    final User user = userService.getUser(userId);
    return !userPreferencesService.checkUserPreferences(
        user,
        UserPreference.VIEW_STATISTICS,
        "true");
  }

  private Map<LocalDate, Long> getParticipationsPerMonth(List<Participation> participations) {
    return participations.stream()
        .collect(Collectors.groupingBy(
            p -> getStartOfMonth(p.getCourse().getStart()),
            Collectors.counting()));
  }

  private LocalDate getStartOfMonth(final LocalDateTime dateTime) {
    return LocalDate.of(dateTime.getYear(), dateTime.getMonth(), 1);
  }

  /**
   * Get the UUID of the {@link freya.fitness.domain.jpa.CourseType} with the most
   * occurences in a given List of {@link Participation}.
   * Also the count will be returned in the same Map.Entry.
   *
   * @param participations given {@link Participation}s
   * @return Map.Entry with UUID of the course type and count
   */
  private Map.Entry<CourseType, Long> getMaximumCourseParticipation(
      final List<Participation> participations) {

    final Map<CourseType, Long> countByType = new HashMap<>();
    for (Participation participation : participations) {
      final Course course = participation.getCourse();
      final CourseType courseType = course.getType();
      long count = 1;
      if (countByType.containsKey(courseType)) {
        count = countByType.get(courseType) + 1;
      }
      countByType.put(courseType, count);
    }

    return countByType.entrySet().stream()
        .max(compareByCountAndThenName())
        .orElse(null);
  }

  private Comparator<? super Map.Entry<CourseType, Long>> compareByCountAndThenName() {
    return Comparator.comparing((Function<Map.Entry<CourseType, Long>, Long>) Map.Entry::getValue)
        .thenComparing(Comparator.comparing(
            (Map.Entry<CourseType, Long> e) -> e.getKey().getName()).reversed());
  }

  private LocalDateTime getStartForLastSixMonths() {
    final LocalDateTime fiveMonthsAgo = LocalDateTime.now().minusMonths(5);
    return LocalDateTime.of(
        LocalDate.of(fiveMonthsAgo.getYear(), fiveMonthsAgo.getMonth(), 1),
        LocalTime.MIDNIGHT);

  }

}
