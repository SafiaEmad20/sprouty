using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace Sprouty.Infrastructure.Persistence.Converters;

// SQL Server's datetime2 doesn't remember that a value is UTC, so dates read back from the
// database came out as "Unspecified" and were sent to the frontend without a trailing "Z".
// The app only stores UTC (DateTime.UtcNow), so every DateTime read back is marked as UTC.
public class UtcDateTimeConverter : ValueConverter<DateTime, DateTime>
{
    public UtcDateTimeConverter()
        : base(
            value => value.Kind == DateTimeKind.Local ? value.ToUniversalTime() : value,
            value => DateTime.SpecifyKind(value, DateTimeKind.Utc))
    {
    }
}
