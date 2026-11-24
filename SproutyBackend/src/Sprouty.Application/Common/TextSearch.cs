using System.Globalization;
using System.Text;

namespace Sprouty.Application.Common
{
    // بحث ذكي في أسماء النباتات (عربي وإنجليزي):
    // - حرف واحد: يطلع بس النباتات اللي اسمها (أو كلمة في اسمها) بتبدأ بالحرف ده.
    // - حرفين أو أكتر: بداية الاسم، بداية أي كلمة، أو جوه الاسم (من 3 حروف).
    // - غلطة صغيرة في الكتابة أو حرفين مقلوبين (من 3 حروف): بيطلع برضه، بس ترتيبه بعد المطابق.
    // - بيتجاهل التشكيل والفرق بين (أ إ آ ا) و(ة ه) و(ى ي) وحروف كابيتال/سمول.
    public static class TextSearch
    {
        public const int MaxQueryLength = 50;

        // Returns a relevance score: 0 means no match, higher is a better match.
        public static int Score(string? query, params string?[] fields)
        {
            var q = Normalize(query);
            if (q.Length == 0)
            {
                return 1;
            }

            var best = 0;
            foreach (var field in fields)
            {
                var text = Normalize(field);
                if (text.Length == 0)
                {
                    continue;
                }

                best = Math.Max(best, ScoreField(q, text));
            }

            return best;
        }

        public static string Normalize(string? value)
        {
            if (string.IsNullOrWhiteSpace(value))
            {
                return string.Empty;
            }

            var trimmed = value.Trim();
            if (trimmed.Length > MaxQueryLength * 4)
            {
                trimmed = trimmed[..(MaxQueryLength * 4)];
            }

            var builder = new StringBuilder(trimmed.Length);
            var lastWasSpace = false;

            foreach (var raw in trimmed.Normalize(NormalizationForm.FormD))
            {
                var category = CharUnicodeInfo.GetUnicodeCategory(raw);

                // Latin accents and Arabic diacritics (tashkeel) are dropped.
                if (category == UnicodeCategory.NonSpacingMark)
                {
                    continue;
                }

                var c = char.ToLowerInvariant(raw);

                c = c switch
                {
                    'أ' or 'إ' or 'آ' or 'ٱ' => 'ا',
                    'ة' => 'ه',
                    'ى' => 'ي',
                    'ؤ' => 'و',
                    'ئ' => 'ي',
                    _ => c
                };

                if (c == 'ـ')
                {
                    continue; // tatweel
                }

                if (char.IsLetterOrDigit(c))
                {
                    builder.Append(c);
                    lastWasSpace = false;
                }
                else if (!lastWasSpace && builder.Length > 0)
                {
                    builder.Append(' ');
                    lastWasSpace = true;
                }
            }

            return builder.ToString().TrimEnd();
        }

        private static int ScoreField(string q, string text)
        {
            if (text == q)
            {
                return 100;
            }

            if (text.StartsWith(q, StringComparison.Ordinal))
            {
                return 90;
            }

            var words = text.Split(' ', StringSplitOptions.RemoveEmptyEntries);

            if (words.Any(w => w.StartsWith(q, StringComparison.Ordinal)))
            {
                return 80;
            }

            if (q.Length == 1)
            {
                return 0;
            }

            if (q.Length >= 3 && text.Contains(q, StringComparison.Ordinal))
            {
                return 60;
            }

            if (q.Length < 3)
            {
                return 0;
            }

            // Typos: compare the query with the start of each word (and the whole text),
            // so "mnit" finds "Mint" and "نعنع" finds "نعناع".
            var allowed = q.Length >= 6 ? 2 : 1;
            var bestDistance = int.MaxValue;

            foreach (var candidate in words.Append(text))
            {
                foreach (var length in new[] { q.Length - 1, q.Length, q.Length + 1 })
                {
                    if (length < 1 || length > candidate.Length)
                    {
                        continue;
                    }

                    var part = candidate[..length];

                    // With only 3 letters a replaced letter matches too many names, so 3-letter
                    // queries forgive a swap ("mni" → "min") or a missing letter ("زهر" → "زهور") only.
                    if (q.Length == 3 && !(SameLetters(q, part) || IsSubsequence(q, part)))
                    {
                        continue;
                    }

                    var distance = Distance(q, part);
                    bestDistance = Math.Min(bestDistance, distance);
                }
            }

            return bestDistance <= allowed ? 50 - (bestDistance * 10) : 0;
        }

        private static bool IsSubsequence(string q, string text)
        {
            if (text.Length != q.Length + 1)
            {
                return false;
            }

            var i = 0;
            foreach (var c in text)
            {
                if (i < q.Length && q[i] == c)
                {
                    i++;
                }
            }

            return i == q.Length;
        }

        private static bool SameLetters(string a, string b) =>
            a.Length == b.Length && a.OrderBy(c => c).SequenceEqual(b.OrderBy(c => c));

        // Optimal string alignment distance: insert, delete, replace, or swap two neighbours.
        private static int Distance(string a, string b)
        {
            var d = new int[a.Length + 1, b.Length + 1];

            for (var i = 0; i <= a.Length; i++)
            {
                d[i, 0] = i;
            }

            for (var j = 0; j <= b.Length; j++)
            {
                d[0, j] = j;
            }

            for (var i = 1; i <= a.Length; i++)
            {
                for (var j = 1; j <= b.Length; j++)
                {
                    var cost = a[i - 1] == b[j - 1] ? 0 : 1;

                    d[i, j] = Math.Min(
                        Math.Min(d[i - 1, j] + 1, d[i, j - 1] + 1),
                        d[i - 1, j - 1] + cost);

                    if (i > 1 && j > 1 && a[i - 1] == b[j - 2] && a[i - 2] == b[j - 1])
                    {
                        d[i, j] = Math.Min(d[i, j], d[i - 2, j - 2] + 1);
                    }
                }
            }

            return d[a.Length, b.Length];
        }
    }
}
