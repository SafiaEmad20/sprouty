
using System;

namespace Sprouty.Application.Exceptions
{
    public class SensorOfflineException : Exception
    {
        public SensorOfflineException(string message) : base(message)
        {
        }
    }
}
