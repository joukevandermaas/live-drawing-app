using Draw.Models;
using FIODraw.Models;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Draw.Hubs
{
	public class DrawHub
		: Hub
	{
		private static readonly List<Line> lines = new List<Line>();
		private static readonly Looper<Color> colors = new Looper<Color>(new Color[]
		{
			Color.FromRgb(255, 0, 0),
			Color.FromRgb(0, 255, 0),
			Color.FromRgb(0, 0, 255)
		});

		public Task Draw(int oldX, int oldY, int newX, int newY, string color)
		{
			lines.Add(new Line(new Point(oldX, oldY), new Point(newX, newY), color));
			return Clients.Others.SendAsync("draw", oldX, oldY, newX, newY, color);
		}

		public Task Clear()
		{
			lines.Clear();
			return Clients.Others.SendAsync("clear");
		}

		public override Task OnConnectedAsync() => Clients.Caller.SendAsync("initialize", lines, colors.GetValue());
	}
}
