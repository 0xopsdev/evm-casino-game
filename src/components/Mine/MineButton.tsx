import { Button } from "@heroui/react";
import { ExpolitionBombSvg, JewlSvg } from "../svgs";
import { MINE_OBJECT, MineArea, MineButtonProps } from "./types";



const MineButton = ({ point, mine, isAuto, onClick }: MineButtonProps) => {
  const handleClick = () => {
    onClick(point);
  };

  const renderMineContent = (mine: MineArea | undefined) => {
    if (!mine?.mined) return null;

    const isGem = mine.mine === MINE_OBJECT.GEM;
    const isBomb = mine.mine === MINE_OBJECT.BOMB;

    if (isGem) {
      return (
        <div className="animate-bounding">
          <JewlSvg />
        </div>
      );
    }

    if (isBomb) {
      return (
        <div className="animate-bounding relative">
          <img
            src={'/assets/image/mineEffect.webp'}
            className="z-10 absolute inset-0 w-full h-full"
            alt="mine effect"
          />
          <ExpolitionBombSvg />
        </div>
      );
    }

    return null;
  };

  const renderHiddenMineContent = (mine: MineArea | undefined) => {
    if (mine?.mined) return null;

    const isGem = mine?.mine === MINE_OBJECT.GEM;
    const isBomb = mine?.mine === MINE_OBJECT.BOMB;

    if (isGem) {
      return (
        <div className="animate-bounding opacity-40 p-2">
          <JewlSvg />
        </div>
      );
    }

    if (isBomb) {
      return (
        <div className="animate-bounding opacity-40 p-2">
          <ExpolitionBombSvg />
        </div>
      );
    }

    return null;
  };

  const svgContent = renderMineContent(mine) ||
    renderHiddenMineContent(mine) || (
      <div className="w-full relative pb-full" />
    );

  return (
    <Button
      className={
        mine?.mine
          ? `p-2 w-full h-full rounded-lg aspect-square bg-white/20 ${isAuto && "border-[5px] border-[#9000ff]"
          }`
          : mine
            ? `p-2 animate-bounding1 w-full h-full rounded-lg aspect-square ${isAuto ? "bg-[#9000ff]" : "bg-white/20"
            }`
            : `p-2 w-full h-full rounded-lg aspect-square ${isAuto ? "bg-[#9000ff]" : "bg-white/20"
            }`
      }
      onClick={handleClick}
    >
      {svgContent}
    </Button>
  );
};

export default MineButton