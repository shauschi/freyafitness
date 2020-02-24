package freya.fitness.api.statistic;

import freya.fitness.api.course.Course;
import freya.fitness.api.course.CourseType;
import freya.fitness.api.membership.Participation;
import freya.fitness.api.membership.ParticipationService;
import freya.fitness.api.user.User;
import freya.fitness.api.user.UserPreference;
import freya.fitness.api.user.UserPreferencesService;
import freya.fitness.api.user.UserService;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
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

    final LocalDateTime start = getStartForLastSixMonths();
    final List<Participation> participations =
        participationService.getParticipationsBetween(userId, start, LocalDateTime.now());

    final StatisticDto stats = new StatisticDto();
    stats.setUserId(userId);

    stats.setParticipationsPerType(
        getCourseParticipationsPerType(participations));

    final Map<LocalDate, Long> participationsPerMonth = getParticipationsPerMonth(participations);
    for (int i = 0; i < 5; i++) {
      final LocalDate localDate = start.plusMonths(i).toLocalDate();
      if (!participationsPerMonth.containsKey(localDate)) {
        participationsPerMonth.put(localDate, 0L);
      }
    }
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
   * Get the UUID of the {@link CourseType} and the
   * occurences in a given List of {@link Participation}.
   *
   * @param participations given {@link Participation}s
   * @return Map with UUID of the course type and count
   */
  private Map<UUID, Long> getCourseParticipationsPerType(
      final List<Participation> participations) {

    final Map<UUID, Long> countByType = new HashMap<>();
    for (Participation participation : participations) {
      final Course course = participation.getCourse();
      final CourseType courseType = course.getType();
      final UUID courseTypeId = courseType.getId();
      long count = 1;
      if (countByType.containsKey(courseTypeId)) {
        count = countByType.get(courseTypeId) + 1;
      }
      countByType.put(courseTypeId, count);
    }

    return countByType;
  }

  private LocalDateTime getStartForLastSixMonths() {
    final LocalDateTime fiveMonthsAgo = LocalDateTime.now().minusMonths(5);
    return LocalDateTime.of(
        LocalDate.of(fiveMonthsAgo.getYear(), fiveMonthsAgo.getMonth(), 1),
        LocalTime.MIDNIGHT);

  }

}
