using Draw.Models;
using FIODraw.Models;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace Draw.Hubs
{
	public class DrawHub
		: Hub
	{
		private static readonly HttpClient httpClient = new HttpClient();
		private static readonly List<Line> lines = new List<Line>();
		private static readonly Looper<Color> colors = new Looper<Color>(new Color[]
		{
			Color.FromRgb(227, 2, 127),
			Color.FromRgb(1, 102, 179),
			Color.FromRgb(0, 159, 142),
			Color.FromRgb(176, 42, 48),
			Color.FromRgb(130, 107, 99),
			Color.FromRgb(221, 114, 31),
			Color.FromRgb(103, 174, 62),
		});

		public Task Draw(int oldX, int oldY, int newX, int newY, string color)
		{
			lines.Add(new Line(new Point(oldX, oldY), new Point(newX, newY), color));
			return Clients.Others.SendAsync("draw", oldX, oldY, newX, newY, color);
		}

		public Task Redraw() => Clients.Caller.SendAsync("redraw", lines);

		public Task Clear()
		{
			lines.Clear();
			return Clients.Others.SendAsync("clear");
		}

		[HubMethodName("image")]
		public async Task SendImage(string base64Image)
		{
			using (var content = new StringContent(base64Image, Encoding.UTF8, "text/plain"))
			using (HttpResponseMessage response = await httpClient.PostAsync("https://8168dc7e.ngrok.io/sendPicture/", content)) {
			}
		}

		public override Task OnConnectedAsync() => Clients.Caller.SendAsync("initialize", lines, colors.GetValue().ToHexadecimalString());
	}
}
