using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FIODraw.Models
{
	public struct Color
	{
		public byte Red { get; }

		public byte Green { get; }

		public byte Blue { get; }

		public Color(byte red, byte green, byte blue)
		{
			Red = red;
			Green = green;
			Blue = blue;
		}

		public static Color FromRgb(byte red, byte green, byte blue) => new Color(red, green, blue);

		public string ToHexadecimalString() => $"#{Red.ToString("X2")}{Green.ToString("X2")}{Blue.ToString("X2")}";
	}
}
