namespace Draw.Models
{
	public struct Line
	{
		public Point From { get; }

		public Point To { get; }

		public string Color { get; set; }

		public Line(Point from, Point to, string color)
		{
			From = from;
			To = to;
			Color = color;
		}
	}
}
