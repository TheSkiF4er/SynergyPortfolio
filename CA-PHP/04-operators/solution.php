<?php
declare(strict_types=1);
function combinedOperations(): array {
    $value = 0; $steps = [['Старт', $value]];
    $value += 7; $steps[] = ['+= 7', $value];
    $value *= 4; $steps[] = ['*= 4', $value];
    $value -= 8; $steps[] = ['-= 8', $value];
    $value /= 4; $steps[] = ['/= 4', $value];
    $value **= 3; $steps[] = ['**= 3', $value];
    $value %= 3; $steps[] = ['%= 3', $value];
    return $steps;
}
function variableVariables(): array {
    $first = 50; $second = 70; $pupil = 'first'; $student = 'second';
    return [${$pupil}, ${$student}];
}
