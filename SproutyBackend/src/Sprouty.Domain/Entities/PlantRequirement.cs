using System;
using System.Collections.Generic;
using System.Text;

namespace Sprouty.Domain.Entities
{
    public class PlantRequirement
    {
        public Guid Id { get; set; }
        public Guid PlantTypeId { get; set; }

        public  float MinMoisture { get; set; }       
        public  float  MaxMoisture { get; set; }
        public  float MinTemperature { get; set; }   
        public  float  MaxTemperature { get; set; }
        public  float  MinHumidity { get; set; }       
        public  float  MaxHumidity { get; set; }
        public  float  MinLight { get; set; }          
        public  float  MaxLight { get; set; }

        public PlantType PlantType { get; set; } = null!;
    }
}
