using System;
using System.Collections.Generic;
using System.Text;

namespace Sprouty.Domain.Enums;

public enum PlantStatus
{
    NoData = 0,
    Healthy = 1,
    NeedsWater = 2,
    OverWatered = 3,
    TooHot = 4,
    TooCold = 5,
    NeedsLight = 6
}

