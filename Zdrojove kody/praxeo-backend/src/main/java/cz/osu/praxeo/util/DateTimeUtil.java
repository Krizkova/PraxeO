package cz.osu.praxeo.util;

import lombok.experimental.UtilityClass;

import java.time.*;

@UtilityClass
public class DateTimeUtil {

    public static OffsetDateTime map(Instant value) {
        return value == null ? null : OffsetDateTime.ofInstant(value, getZone());
    }

    public OffsetDateTime map(LocalDate value) {
        return value == null ? null : value.atStartOfDay(getZone()).toOffsetDateTime();
    }

    public OffsetDateTime map(LocalDateTime value) {
        return value == null ? null : value.atOffset(getOffset(value));
    }

    public ZoneOffset getOffset(LocalDateTime value) {
        return getZone().getRules().getOffset(value);
    }

    public static ZoneId getZone() {
        return ZoneId.systemDefault();
    }

    public static ZoneOffset getZoneOffset() {

        return ZoneOffset.UTC;
    }

    public static Instant map(OffsetDateTime offsetDateTime) {

        return offsetDateTime.toInstant();
    }
}
