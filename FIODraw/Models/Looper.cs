using System.Collections.Generic;

namespace FIODraw.Models
{
	public class Looper<T>
	{
		private readonly Queue<T> queue;

		public Looper(IEnumerable<T> collection) => queue = new Queue<T>(collection);

		public T GetValue()
		{
			T value = queue.Dequeue();
			queue.Enqueue(value);
			return value;
		}
	}
}
