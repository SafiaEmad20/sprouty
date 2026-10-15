using System;
using System.Collections.Generic;
using System.Text;

namespace Sprouty.Domain.Entities
{
    public class PlantType
    {
        public Guid Id { get; set; }
        public string NameAr { get; set; } = string.Empty;
        public string NameEn { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;   
        public string? ImageUrl { get; set; }

        public PlantRequirement? Requirement { get; set; }
        public ICollection<Plant> Plants { get; set; } = new List<Plant>();
    }

}
