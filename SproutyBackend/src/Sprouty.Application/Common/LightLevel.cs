namespace Sprouty.Application.Common
{
    // حساس الضوء (LDR) بيدي رقم خام من 0 لـ 4095: كل ما الرقم يزيد، المكان يبقى أضلم.
    // هنا بنحوّله لنسبة إضاءة من 0 (ضلمة) لـ 100 (نور قوي)، وهي نفس وحدة الـMinLight/MaxLight.
    public static class LightLevel
    {
        public const double MaxRaw = 4095.0;

        // Exact value, used by the plant status rules.
        public static double FromRaw(double raw)
        {
            var level = (MaxRaw - raw) / MaxRaw * 100.0;

            return Math.Clamp(level, 0.0, 100.0);
        }

        // Rounded to one decimal, for API responses.
        public static double ForDisplay(double raw) => Math.Round(FromRaw(raw), 1);
    }
}
