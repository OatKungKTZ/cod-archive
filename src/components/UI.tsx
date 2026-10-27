import { ArrowUpRight, ShieldCheck } from "lucide-react";
import {
  cloneElement,
  isValidElement,
  type ReactNode,
  useId,
  useState,
} from "react";
import { Link } from "react-router-dom";
import { type Game, seriesLabel } from "../data/games";
import coverAssets from "../data/covers.json";
import {
  blankGame,
  ownershipLabels,
  playLabels,
  type UserState,
} from "../domain/model";
export function Cover({
  game,
  large = false,
}: {
  game: Game;
  large?: boolean;
}) {
  const [failure, setFailure] = useState({ gameId: "", stage: 0 });
  const stage = failure.gameId === game.id ? failure.stage : 0;
  const asset = coverAssets[game.id as keyof typeof coverAssets];
  const useOfficial = !!asset && stage === 0;
  const src = `${import.meta.env.BASE_URL}covers/${useOfficial ? asset.file : `${game.id}.svg`}`;
  return (
    <div
      className={`cover ${large ? "cover-large" : ""}`}
      style={{ "--cover-accent": game.color } as React.CSSProperties}
    >
      {stage < 2 ? (
        <img
          src={src}
          alt={
            useOfficial ? `ภาพปก ${game.title}` : `ภาพทดแทนสำหรับ ${game.title}`
          }
          decoding="async"
          onError={() => setFailure({ gameId: game.id, stage: stage + 1 })}
        />
      ) : (
        <span>{game.short}</span>
      )}
      {!useOfficial && (
        <span className="cover-corner">
          ARCHIVE / {String(game.order).padStart(2, "0")}
        </span>
      )}
    </div>
  );
}
export function PageHead({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="page-head">
      <div>
        <div className="eyebrow">{eyebrow}</div>
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {action}
    </div>
  );
}
export function Badge({
  children,
  tone = "muted",
}: {
  children: ReactNode;
  tone?: string;
}) {
  return <span className={`badge ${tone}`}>{children}</span>;
}
export function GameCard({ game, state }: { game: Game; state: UserState }) {
  const user = state.games[game.id] ?? blankGame();
  return (
    <Link to={`/games/${game.id}`} className="game-card">
      <Cover game={game} />
      <div className="game-card-body">
        <div className="row">
          <span className="tiny">{seriesLabel[game.series]}</span>
          <ArrowUpRight size={16} />
        </div>
        <h3>{game.title.replace("Call of Duty: ", "")}</h3>
        <p className="tiny">{game.year ?? "ปีวางจำหน่ายรอยืนยัน"}</p>
        <div className="badges">
          <Badge tone={user.ownership === "owned" ? "green" : "muted"}>
            {ownershipLabels[user.ownership]}
          </Badge>
          {user.play !== "unknown" && <Badge>{playLabels[user.play]}</Badge>}
        </div>
      </div>
    </Link>
  );
}
export function Empty({ children }: { children: ReactNode }) {
  return (
    <div className="empty">
      <ShieldCheck size={28} />
      <p>{children}</p>
    </div>
  );
}
export function Progress({ value }: { value: number }) {
  return (
    <div
      className="progress"
      role="progressbar"
      aria-label="ความคืบหน้า"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <span style={{ width: `${value}%` }} />
    </div>
  );
}
export function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  const id = useId();
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      {isValidElement<{ id?: string }>(children)
        ? cloneElement(children, { id })
        : children}
    </div>
  );
}
