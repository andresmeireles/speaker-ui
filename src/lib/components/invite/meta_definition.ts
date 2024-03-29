import { InviteStatus, type Meta } from "$lib";

export class MetaDefinition {
	public static waitingConfirmation(): Meta {
		return {
			color: "bg-slate-200",
			label: "Waiting confirmation"
		}
	}

	public static confirmed(): Meta {
		return {
			color: "bg-amber-200",
			label: "Confirmed"
		}
	}

	public static rejected(): Meta {
		return {
			color: "bg-red-200",
			label: "Rejected"
		}
	}

	public static remembered(): Meta {
		return {
			color: "bg-blue-200",
			label: "Remembered"
		}
	}

	public static waitingRemember(): Meta {
		return {
			color: "bg-blue-100",
			label: "Waiting remember"
		}
	}

	public static notDone(): Meta {
		return {
			color: "bg-orange-200",
			label: "Not done"
		}
	}

	public static done(): Meta {
		return {
			color: "bg-green-200",
			label: "Done"
		}
	}

	public static getMeta(status: number): Meta {
		switch (status) {
			case InviteStatus.CONFIRMED:
				return MetaDefinition.confirmed();
			case InviteStatus.REMEMBERED:
				return MetaDefinition.remembered();
			case InviteStatus.WAIT_REMEMBER:
				return MetaDefinition.waitingRemember();
			case InviteStatus.DONE:
				return MetaDefinition.done();
			case InviteStatus.NOT_DONE:
				return MetaDefinition.notDone();
			case InviteStatus.REJECTED:
				return MetaDefinition.rejected();
			default:
				return MetaDefinition.waitingConfirmation();
		}
	}
}